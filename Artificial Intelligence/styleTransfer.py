#!/usr/bin/env python
# coding: utf-8

#-------- Imports --------

import tensorflow as tf

#if you want to display the images using imshow remove these comments
#import matplotlib.pyplot as plt
#import matplotlib as mpl
#mpl.rcParams['figure.figsize'] = (12, 12)
#mpl.rcParams['axes.grid'] = False

#this will be used for matrix operations
import numpy as np

#allows python code to edit the images
import PIL.Image

#to time the efficiency or speed of our optimization
import time

#pretrained model we will be using to extrac the features of the images 
from keras.applications.vgg19 import VGG19

#----------- Image processing --------------

#converting the N-dimentional array to an image

def tensor_to_image(tensor):
  tensor = tensor*255
  tensor = np.array(tensor, dtype=np.uint8) # image converted to numpy array
  if np.ndim(tensor)>3:
    assert tensor.shape[0] == 1
    tensor = tensor[0]
  return PIL.Image.fromarray(tensor)

#Function to process the images so they can be 
# compatible with the tensorflow model 
def load_img(path_to_img):
  max_size = 512 #max size of the generated image
  img = tf.io.read_file(path_to_img)
  img = tf.image.decode_image(img, channels=3)
  img = tf.image.convert_image_dtype(img, tf.float32)

  shape = tf.cast(tf.shape(img)[:-1], tf.float32) #converting the image to a tensor
  long_dim = max(shape)
  scale = max_size / long_dim #dimensions for generated image

  new_shape = tf.cast(shape * scale, tf.int32)

  img = tf.image.resize(img, new_shape)
  img = img[tf.newaxis, :]
  return img

#images to use 
content_image_path = sys.argv[1]
style_image_path = sys.argv[2]

#load the images
content_image = load_img(content_image_path)
style_image = load_img(style_image_path)

#pick the convolution layers 
content_layers = ['block5_conv2'] 

style_layers = ['block1_conv1',
                'block2_conv1',
                'block3_conv1', 
                'block4_conv1', 
                'block5_conv1']

num_content_layers = len(content_layers)
num_style_layers = len(style_layers)

#remove the comments bellow to view the images you are about to style
"""def imshow(image, title=None):
  if len(image.shape) > 3:
    image = tf.squeeze(image, axis=0)

  plt.imshow(image)
  if title:
    plt.title(title)

#print the two images 
plt.subplot(1, 2, 1)
imshow(content_image, 'Content Image')

plt.subplot(1, 2, 2)
imshow(style_image, 'Style Image')"""

#------- Load the model --------

#preprocess raw images to make it suitable to be used by VGG19 model
#VGG19 has 16 convolution layers, 3 Fully connected layer, 5 MaxPool layers and 1 SoftMax layer
#We give input of a (224*224) RGB image -> matrix is of the shape (244,244,3)
x = tf.keras.applications.vgg19.preprocess_input(content_image*255)
x = tf.image.resize(x, (224, 224))

#loading the VGG model that was pretrained on the imagenet dataset
#We don't need to (or want to) train any layers of our pre-trained 
# vgg model, so we set it's trainable to false.
vgg = VGG19(include_top=True, weights='imagenet')
vgg.trainable = False

#Creates a vgg model that returns a list of intermediate output values
#reload the model and get the layers (features of image on each layer)
def vgg_layers(layer_names):

  vgg = VGG19(include_top=False, weights='imagenet')
  vgg.trainable = False

  outputs = [vgg.get_layer(name).output for name in layer_names]

  model = tf.keras.Model([vgg.input], outputs)
  #build the model
  return model

#call the layer extracting function and get the features of the style image
style_extractor = vgg_layers(style_layers)
style_outputs = style_extractor(style_image*255)

#--------- prer for loss ---------

# if input tensor is a 3D array of size h x w X c
# we reshape it to a 2D array of Nc x (Nh*Nw) 
# tf.linalg.einsum will compute the gram matrix 
# product of the input tensor for each location in the image divided by the number of locations
def gram_matrix(input_tensor):
  result = tf.linalg.einsum('bijc,bijd->bcd', input_tensor, input_tensor)
  input_shape = tf.shape(input_tensor)
  num_locations = tf.cast(input_shape[1]*input_shape[2], tf.float32)
  return result/(num_locations)


#---------------- Style + content feature extraction ---------------
class StyleContentModel(tf.keras.models.Model):
  def __init__(self, style_layers, content_layers):
    super(StyleContentModel, self).__init__()
    self.vgg = vgg_layers(style_layers + content_layers)
    self.style_layers = style_layers
    self.content_layers = content_layers
    self.num_style_layers = len(style_layers)
    self.vgg.trainable = False

  def call(self, inputs):
    "Expects float input in [0,1]"
    inputs = inputs*255.0
    preprocessed_input = tf.keras.applications.vgg19.preprocess_input(inputs)
    outputs = self.vgg(preprocessed_input)
    style_outputs, content_outputs = (outputs[:self.num_style_layers],
                                      outputs[self.num_style_layers:])

    # Get the style and content feature representations from our model layers 
    style_outputs = [gram_matrix(style_output)
                     for style_output in style_outputs]

    content_detected = {content_name: value
                    for content_name, value
                    in zip(self.content_layers, content_outputs)}

    style_detected = {style_name: value
                  for style_name, value
                  in zip(self.style_layers, style_outputs)}

    return {'content': content_detected, 'style': style_detected}



extractor = StyleContentModel(style_layers, content_layers)

results = extractor(tf.constant(content_image))

style_targets = extractor(style_image)['style']
content_targets = extractor(content_image)['content']

#generated image has the same dimensions as the content image
image = tf.Variable(content_image) 

# Make sure tensor values stay in the range of 
# maximum and min values suitable for the VGG model
def clip_0_1(image):
  return tf.clip_by_value(image, clip_value_min=0.0, clip_value_max=1.0)


#We will need this to create our generated image in the training or optimizing step
opt = tf.optimizers.Adam(learning_rate=0.02, beta_1=0.99, epsilon=1e-1)


style_weight=1e-2
content_weight=1e4

#------------ Loss functions ------------------
def style_content_loss(outputs):
    style_outputs = outputs['style']
    content_outputs = outputs['content']
    style_loss = tf.add_n([tf.reduce_mean((style_outputs[name]-style_targets[name])**2) 
                           for name in style_outputs.keys()])
    style_loss *= style_weight / num_style_layers

    content_loss = tf.add_n([tf.reduce_mean((content_outputs[name]-content_targets[name])**2) 
                             for name in content_outputs.keys()])
    content_loss *= content_weight / num_content_layers
    total_loss = style_loss + content_loss
    return total_loss


# getting the inverse of the image
# reverses the x coords - mirror on x in the image 
# reverses the y coords - mirror on y in the image 
# converting bgr to rgb
def high_pass_x_y(image):
  x_var = image[:, :, 1:, :] - image[:, :, :-1, :]
  y_var = image[:, 1:, :, :] - image[:, :-1, :, :]

  return x_var, y_var

x_deltas, y_deltas = high_pass_x_y(content_image)


def total_variation_loss(image):
  x_deltas, y_deltas = high_pass_x_y(image)
  #minimize the total loss as much as possible for each step
  return tf.reduce_sum(tf.abs(x_deltas)) + tf.reduce_sum(tf.abs(y_deltas))

tf.image.total_variation(image).numpy()

#-------------- Optimizattion ---------------------

total_variation_weight=30

@tf.function()
def train_step(image):
  # GradientTape will update the image through each iteration
  with tf.GradientTape() as tape: 
    outputs = extractor(image)
    loss = style_content_loss(outputs)
    loss += total_variation_weight*tf.image.total_variation(image)

  # get the gradient loss (gradient desent to minimize the loss function) for the image 
  grad = tape.gradient(loss, image)
  # upate the weights (intensity of the pixels) in the image by the grad
  opt.apply_gradients([(grad, image)])
  # assign the clipped value to the tensor stylized image
  image.assign(clip_0_1(image))


image = tf.Variable(content_image)


# using import time to teste efficiency of the program execution
start = time.time()

#number of iterations
iterations = 20

#initial training step for optimization
step = 0

for n in range(iterations):
  step += 1
  train_step(image)

#remove the next two comments to print the image to the screen
#  display.display(tensor_to_image(image)) 
#  print("Train step: {}".format(step))

#time lapse for image optimization
end = time.time()
print("Total time: {:.1f}".format(end-start))

# save the generated image

file_name = 'generated.png'
generated_img = tensor_to_image(image)
generated_img.save(file_name)

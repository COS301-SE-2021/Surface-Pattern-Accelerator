var request = require('supertest');
var app = require('../server');

describe("homepage", function() {
    it("welcomes theuser", function (done){
        request(app).get("/")
        .expect(200)
        .expect(/Hello fine user/, done)
    })
})

describe("google login", function() {
    it("creates a login redirect for the user", function (done){
        request(app).get("/api/googleLogin")
        .expect('Content-Type', /json/)
        
        //.expect(/Hello fine user/, done)
        // https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https://www.googleapis.com/auth/drive&response_type=code&client_id=838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com&redirect_uri=http://localhost:8100/loginResponse
    })
})

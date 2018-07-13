const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {
    before(function() {
        return runServer;
    });
    after(function() {
        return closeServer;
    });

    it('should return blog post on GET', function() {
        return chai
        .request(app)
        .get('/blog-post')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);

            const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object')
                expect(item).to.include.keys(expectedKeys)
            });
        });
    });

    it('should add a blog post on POST', function() {
        const newBlogPost = {title : 'TGIF!', content: 'I am soo ready for the weekend!', author: 'ME'};
        return chai
        .request(app)
        .post('/blog-post')
        .send(newBlogPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.include(Object.assign(newBlogPost, {id: res.body.id}));
        });
    });

    it('should update blog post on PUT', function() {
        const updateBlogPost = {title: "It's Friday!", content: "I'm so ready for the weekend!", author: "ME"};

        return chai
            .request(app)
            .get('/blog-post')
            .then(function(res) {
                updateBlogPost.id = res.body[0].id;

                return chai
                .request(app) 
                .put(`/blog-post/${updateBlogPost.id}`)
                .send(updateBlogPost)
            })

            .then(function(res) {
                expect(res).to.have.status(204);
                //expect(res).to.be.json;
                //expect(res.body).to.be.a('object');
                //expect(res.body).to.deep.equal(updateBlogPost);
            });
    });

    it('should delete blog post on DELETE', function() {
        return (
            chai
            .request(app)
            .get('/blog-post')
            .then(function(res) {
                return chai
                .request(app)
                .delete(`/blog-post/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            })
        );
    });
});
const request = require('supertest');
const assert = require('assert');
const association = require('../../models/association/association');
const sequelize = require('../../database/in-memory');

const app = require('../../app');

beforeEach(async () => {
    association();
    return await sequelize
        .sync({ force: true })
        .catch(err => {
            console.log(err);
        });
});

describe('BoardTest', () => {
    test('addBoard', async () => {
        await request(app)
            .post('/boards')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                boardName: 'NewBoard'
            })
            .expect(200)
            .then(result => {
                assert.strictEqual(result.body.boardName, 'NewBoard');
            });
    });
    test('getBoards', async () => {
        await request(app)
            .post('/boards')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                boardName: 'NewBoard'
            });
        await request(app)
            .get('/boards?board_name=NewBoard')
            .expect(200)
            .then(result => {
                assert.strictEqual(result.body[0].boardName, 'NewBoard');
                assert.notStrictEqual(result.body[0].boardName, 'OldBoard');
            });
    });
    test('deleteBoard-success', async () => {
        let boardId;
        await request(app)
            .post('/boards')
            .set('Accept', 'application/json')
            .type('application/json')
            .send({
                boardName: 'NewBoard'
            })
            .then(res => {
                boardId = res.body.id;
            });
        await request(app)
            .delete('/boards/' + boardId)
            .expect(200)
            .then(res => {
                assert.deepStrictEqual(res.body, { Message: 'Deleted Successfull' });
            });
    });
});
import request from 'supertest';
import { expect } from 'chai';
import app from './setup.js';
import Category from '../src/models/Category.js';
import User from '../src/models/User.js';
import Role from '../src/models/Role.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resuelve __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Category Controller', () => {
  let adminToken;

  before(async () => {
    const adminRole = await Role.findOne({ name: 'admin' });

    const admin = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: await User.encryptPassword('adminpassword'),
      role: adminRole._id
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  beforeEach(() => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.readdir(uploadDir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(uploadDir, file), err => {
          if (err && err.code !== 'ENOENT') throw err;
        });
      }
    });
  });

  after(async () => {
    await User.deleteMany({});
    await Category.deleteMany({});
  });

  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-access-token', adminToken)
        .field('name', 'Test Category')
        .field('allowsImages', true)
        .field('allowsVideos', true)
        .field('allowsTexts', true)
        .attach('file', path.join(__dirname, 'fixtures', 'test-image.png'));

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Test Category');
      expect(res.body).to.have.property('coverImageUrl');
    });

    it('should not create a category with a duplicate name', async () => {
      await Category.create({
        name: 'Test Category',
        allowsImages: true,
        allowsVideos: true,
        allowsTexts: true,
        coverImageUrl: '/uploads/test-image.png'
      });
      const res = await request(app)
        .post('/api/v1/categories')
        .set('x-access-token', adminToken)
        .field('name', 'Test Category')
        .field('allowsImages', true)
        .field('allowsVideos', true)
        .field('allowsTexts', true)
        .attach('file', path.join(__dirname, 'fixtures', 'test-image.png'));

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Category already exists');
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should get all categories', async () => {
      const res = await request(app)
        .get('/api/v1/categories')
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    let category;

    beforeEach(async () => {
      category = await Category.create({
        name: 'Update Test',
        allowsImages: true,
        allowsVideos: true,
        allowsTexts: true,
        coverImageUrl: '/uploads/test-image.png'
      });
    });

    it('should update an existing category', async () => {
      const res = await request(app)
        .put(`/api/v1/categories/${category._id}`)
        .set('x-access-token', adminToken)
        .field('name', 'Updated Category')
        .field('allowsImages', false)
        .field('allowsVideos', false)
        .field('allowsTexts', false)
        .attach('file', path.join(__dirname, 'fixtures', 'test-image.png'));

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('name', 'Updated Category');
      expect(res.body).to.have.property('coverImageUrl');
      expect(res.body.allowsImages).to.equal(false);
      expect(res.body.allowsVideos).to.equal(false);
      expect(res.body.allowsTexts).to.equal(false);
    });

    it('should not update a category with a duplicate name', async () => {
      const anotherCategory = await Category.create({
        name: 'Another Category',
        allowsImages: true,
        allowsVideos: true,
        allowsTexts: true,
        coverImageUrl: '/uploads/test-image.png'
      });
      const res = await request(app)
        .put(`/api/v1/categories/${category._id}`)
        .set('x-access-token', adminToken)
        .field('name', 'Another Category')
        .field('allowsImages', false)
        .field('allowsVideos', false)
        .field('allowsTexts', false)
        .attach('file', path.join(__dirname, 'fixtures', 'test-image.png'));

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Category already exists');
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    let category;

    beforeEach(async () => {
      category = await Category.create({
        name: 'Delete Test',
        allowsImages: true,
        allowsVideos: true,
        allowsTexts: true,
        coverImageUrl: '/uploads/test-image.png'
      });
    });

    it('should delete an existing category', async () => {
      const res = await request(app)
        .delete(`/api/v1/categories/${category._id}`)
        .set('x-access-token', adminToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Category deleted successfully');
    });
  });
});

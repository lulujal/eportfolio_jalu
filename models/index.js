const { sequelize, dialect } = require('../config/database');
const Profile = require('./Profile');
const Artifact = require('./Artifact');
const Reflection = require('./Reflection');
const CourseReflection = require('./CourseReflection');

module.exports = {
  sequelize,
  dialect,
  Profile,
  Artifact,
  Reflection,
  CourseReflection
};

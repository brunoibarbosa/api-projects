import Sequelize from 'sequelize';
import database from '../config/database';
import UserGroup from '../models/UserGroup';
import User from '../models/User';
import Category from '../models/Category';
import Project from '../models/Project';
import ProjectImage from '../models/ProjectImage';
import AccountRecovery from '../models/AccountRecovery';
import GroupPermission from '../models/GroupPermission';
import ProjectsCategories from '../models/ProjectsCategories';

const models = [UserGroup, User, Category, Project, ProjectImage, AccountRecovery, GroupPermission,
  ProjectsCategories];

const connection = new Sequelize(database);

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

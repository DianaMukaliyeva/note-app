import { Model } from 'objection';

import Note from './Note';

export default class User extends Model {
  id!: number;
  username!: string;
  password!: string;
  notes!: Note[];

  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      id: { type: 'integer' },
      username: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  static relationMappings = () => ({
    notes: {
      relation: Model.HasManyRelation,
      modelClass: Note,
      join: {
        from: 'users.id',
        to: 'notes.authorId',
      },
    },
  });
}

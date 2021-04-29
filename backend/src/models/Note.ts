import { Model, QueryBuilder } from 'objection';
import User from './User';

export default class Note extends Model {
  id!: number;
  authorId!: number;
  title!: string;
  content!: string;

  static tableName = 'notes';

  static jsonSchema = {
    type: 'object',
    required: ['authorId', 'title', 'content'],
    properties: {
      id: { type: 'integer' },
      authorId: { type: 'integer' },
      title: { type: 'string', minLength: 1, maxLength: 20 },
      content: { type: 'string', minLength: 1, maxLength: 40 },
    },
  };

  static relationMappings() {
    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: (query: QueryBuilder<User>) => query.select('id', 'username'),
        join: {
          from: 'notes.authorId',
          to: 'users.id',
        },
      },
    };
  }
}

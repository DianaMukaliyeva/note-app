import { Model } from 'objection';
import User from './User';

export default class Note extends Model {
  id!: number;
  author_id!: 'integer';
  title!: string;
  content!: string;

  static tableName = 'notes';

  static jsonSchema = {
    type: 'object',
    required: ['author_id', 'title', 'content'],
    properties: {
      id: { type: 'integer' },
      author: { type: 'integer' },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      content: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  static get relationMappings() {
    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'notes.author_id',
          to: 'users.id',
        },
      },
    };
  }
}

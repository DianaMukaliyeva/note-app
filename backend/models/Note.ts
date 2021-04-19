import { Model } from 'objection';

export default class Note extends Model {
  id!: number;
  author!: string;
  title!: string;
  description!: string;
  static tableName = 'notes';
  static jsonSchema = {
    type: 'object',
    required: ['author', 'title', 'description'],
    properties: {
      id: { type: 'integer' },
      author: { type: 'string', minLength: 1, maxLength: 255 },
      title: { type: 'string', minLength: 1, maxLength: 255 },
      description: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };
}

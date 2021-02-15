import Adapters from "next-auth/adapters"

// Extend the built-in models using class inheritance
export default class User extends (<any>Adapters.TypeORM.Models.User.model) {
  // You can extend the options in a models but you should not remove the base
  // properties or change the order of the built-in options on the constructor
  constructor(user_id: number, username: string, role: string, password_hash: string) {
    super(user_id.toString(), username, role, password_hash)
  }
}


type UserSchema = {
  name: string
  target: typeof User
  columns: {
    user_id?:{
      type: 'int'
      unique: boolean
      nullable: boolean
    }
    username?: {
      type: 'varchar'
      unique: boolean
      nullable: boolean
    }
    password_hash?: {
      type: 'varchar'
      nullable: boolean
    }
    role?: {
      type: 'varchar'
      nullable: boolean
    }
  }
}

export const UserSchema: UserSchema = {
  name: 'User',
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    user_id:{
      type: 'int',
      unique: true,
      nullable: false
    },
    username: {
      type: 'varchar',
      unique: true,
      nullable: true,
    },
    password_hash: {
      type: 'varchar',
      nullable: false
    },
    role: {
      type: 'varchar',
      nullable: false
    }
  },
}
const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLID } = require('graphql')

const Book = require('../models/book')
const Author = require('../models/author')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql

// dummy data
// const books = [
//   { name: "Name of the Wind", genre: "Fantasy", authorId: "61a83d4b51ffd713f45ca968" },
//   { name: "The Final Empire", genre: "Fantasy", authorId: "61a83d5751ffd713f45ca96a" },
//   { name: "The Long Earth", genre: "Sci-Fi", authorId: "61a83d5f51ffd713f45ca96c" },
//   { name: "The Hero of Ages", genre: "Fantasy", authorId: "61a83d5751ffd713f45ca96a" },
//   { name: "The Colour of Magic", genre: "Fantasy", authorId: "61a83d5f51ffd713f45ca96c" },
//   { name: "The Light Fantastic", genre: "Fantasy", authorId: "61a83d5f51ffd713f45ca96c" },
// ]
// //
// const authors = [
//   { name: "Patrick Rothfuss", age: 44 },
//   { name: "Brandon Sanderson", age: 42 },
//   { name: "Terry Pratchett", age: 66 },
// ]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve (parent, args) {
        console.log(parent)
        // return _.find(authors, { id: parent.authorId });

        return Author.findById(parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve (parent, args) {
        // return _.filter(books, { authorId: parent.id });

        return Book.find({ authorId: parent.id })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryQuery',
  fields: () => ({
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        console.log(typeof args.id)
        // return _.find(books, { id: args.id });

        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve (parent, args) {
        // return books;
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve (parent, args) {
        // return authors;
        return Author.find({})
      }
    }
  })
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        })

        return author.save()
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve (parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        })

        return book.save()
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
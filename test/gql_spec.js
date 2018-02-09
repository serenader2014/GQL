var gql = require('../lib/gql'),
    knex = require('knex')({}),
    toSQL;

var resourceContext = {
    posts: {
        name: 'posts',
        propAliases: {author: 'author.slug', tags: 'tags.slug', tag: 'tags.slug'},
        relations: []
    },
    tags: {
        name: 'tags',
        propAliases: {},
        relations: []
    },
    users: {
        name: 'users',
        propAliases: {role: 'roles.name'},
        relations: []
    }
};

toSQL = exports.toSQL = function (input, resource) {
    var parsedFilter = gql.parse(input);
    var qb = knex(resource)
    return gql.knexify(qb, parsedFilter, resourceContext[qb._single.table]).toQuery();
};

describe('GQL', function () {
    it('should correctly get from GQL -> SQL', function () {
        toSQL('id:1', 'posts').should.eql('select * from "posts" where "posts"."id" = 1');
    });

    it('should correctly escape bad sequences', function () {
        (function () {toSQL('id:\'1 and 1‘=\'1`\'', 'posts');}).should.throw();
        toSQL('id:\'1 and 1‘=\\\'1`\'', 'posts').should.eql('select * from "posts" where "posts"."id" = \'1 and 1‘=\\\'1`\'');
    });
});

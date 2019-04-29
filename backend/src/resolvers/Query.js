const { forwardTo } = require('prisma-binding')

const Query = {
  /*async items (parent, args, ctx, info) {
      const items = await ctx.db.query.items();
      console.log(items);
      return items;

  }*/
  //if no additional logic, directly forward
  items: forwardTo('db')
};

module.exports = Query;

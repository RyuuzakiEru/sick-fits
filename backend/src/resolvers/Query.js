const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
  /*async items (parent, args, ctx, info) {
      const items = await ctx.db.query.items();
      console.log(items);
      return items;

  }*/
  //if no additional logic, directly forward
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    //  check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    //check if user has permissions to query
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    //query all users

    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    // check logged in

    if (!ctx.request.userId) throw new Error('Please Log In');
    // query order
    const order = await ctx.db.query.order(
      {
        where: {
          id: args.id
        }
      },
      info
    );

    // check permissions (admin or Owns order)
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN'
    );

    if (!ownsOrder && !hasPermissionToSeeOrder)
      throw new Error('Not allowed to see Order');

    // return order
    return order;
  },

  async orders(parent, args, ctx, info) {
    // check logged in

    if (!ctx.request.userId) throw new Error('Please Log In');

    // get all orders or just the ones we own if we are admins
    const ordersWhereQuery = ctx.request.user.permissions.includes('ADMIN')
      ? {}
      : {
          where: {
            user: { id: ctx.request.userId }
          }
        };

    return ctx.db.query.orders(ordersWhereQuery,info);
  }
};

module.exports = Query;

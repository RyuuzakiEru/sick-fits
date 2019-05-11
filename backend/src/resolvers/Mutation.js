const mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO check if user is logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    console.log(item);
    return item;
  },

  updateItem(parent, args, ctx, info) {
      //get copy of item
      const updates = {...args };
      //remove ID
      delete updates.id;
      // run update method
      return ctx.db.mutation.updateItem(
        {
          data: updates,
          where: {
            id: args.id
          }
        },
        info
      );


  },

  async deleteItem( parent, args, ctx, info) {
    const where = {id: args.id};
    //find item
    const item = await ctx.db.query.item({where}, `{id title}`);
    //TODO check permissions

    //Delete
    return ctx.db.mutation.deleteItem({where}, info);
  }

};

module.exports = mutations;

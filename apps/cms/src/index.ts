import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const productPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({
        where: {
          role: publicRole.id,
          action: { $in: ['api::product.product.find', 'api::product.product.findOne'] },
        },
      });

    const existingActions = productPermissions.map((p: any) => p.action);

    for (const action of ['api::product.product.find', 'api::product.product.findOne']) {
      if (!existingActions.includes(action)) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id, enabled: true },
        });
      } else {
        await strapi.query('plugin::users-permissions.permission').updateMany({
          where: { action, role: publicRole.id },
          data: { enabled: true },
        });
      }
    }
  },
};

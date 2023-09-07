import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { educationalResourceValidationSchema } from 'validationSchema/educational-resources';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.educational_resource
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getEducationalResourceById();
    case 'PUT':
      return updateEducationalResourceById();
    case 'DELETE':
      return deleteEducationalResourceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEducationalResourceById() {
    const data = await prisma.educational_resource.findFirst(
      convertQueryToPrismaUtil(req.query, 'educational_resource'),
    );
    return res.status(200).json(data);
  }

  async function updateEducationalResourceById() {
    await educationalResourceValidationSchema.validate(req.body);
    const data = await prisma.educational_resource.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deleteEducationalResourceById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.educational_resource.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
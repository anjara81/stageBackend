const prisma = require("../lib/prisma");

exports.getAll = async (req, res, next) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        actif: true,
        createdAt: true,
        service: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
      orderBy: {
        nom: "asc",
      },
    });

    res.json(utilisateurs);
  } catch (err) {
    next(err);
  }
};
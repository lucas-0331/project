const {PrismaClient} = require('@/generated/prisma/client');
const prisma = new PrismaClient();

exports.isAdmin = async (req, res, next) => {
    const userId = req.user_id;

    if (!userId) {
        return res.status(500).json({error: 'Erro interno: ID de usuário não encontrado após verificação de token.'});
    }

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
            },
            select: {
                role: true,
            },
        });

        if (user && user.role === 'ADMIN') {
            next();
        } else {
            return res.status(403).json({error: 'Acesso proibido. Você não tem permissão de administrador.'});
        }
    } catch (err) {
        console.error('Erro ao buscar papel do usuário:', err);
        return res.status(500).json({error: 'Erro interno ao verificar permissões.'});
    }
}
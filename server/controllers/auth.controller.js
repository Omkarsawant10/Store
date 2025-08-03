import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {prisma} from '../config/db.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        if (!name || !email || !password || !address || !role) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false
            });
        }

        if (name.length < 3 || name.length > 60) {
            return res.status(400).json({
                message: 'Name must be between 3 and 60 characters.',
                success: false
            });
        }

        if (address.length > 400) {
            return res.status(400).json({
                message: 'Address must be under 400 characters.',
                success: false
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
        if (!passwordRegex.test(password) || password.length < 8 || password.length > 16) {
            return res.status(400).json({
                message: 'Password must be 8-16 characters and include one uppercase and one special character.',
                success: false
            });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists with this email.',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                role
            }
        });

        return res.status(201).json({
            message: 'Account created successfully.',
            success: true,
            userId: user.id
        });

    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({
            message: 'Internal server error while creating account.',
            success: false
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Email, password and role are required.',
                success: false
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials.',
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(403).json({
                message: "Role mismatch. Access denied.",
                success: false
            });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            .json({
                message: `Welcome back ${user.name}`,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    role: user.role
                },
                success: true
            });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            message: 'Internal server error during login.',
            success: false
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", {
                httpOnly: true,
                expires: new Date(0),
                sameSite: "None",
                secure: true
            })
            .json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            message: 'Internal server error during logout.',
            success: false
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ user, success: true });

    } catch (error) {
        console.error('GetMe Error:', error);
        return res.status(401).json({
            message: 'Unauthorized or token expired.',
            success: false
        });
    }
};

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Esquema para permisos
const permissionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    modulo: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Esquema para rol
const roleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    permissions: [permissionSchema],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "El nombre de usuario es requerido"],
      unique: true,
      trim: true,
      minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
      maxlength: [30, "El nombre de usuario no puede exceder 30 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es requerido"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: "El correo electrónico no es válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir la contraseña en las consultas por defecto
    },
    status: {
      type: Boolean,
      default: true,
    },
    rol: {
      type: roleSchema,
      required: true,
      default: {
        id: "attendee",
        title: "Asistente",
        permissions: [],
      },
    },
    totpValidation: {
      type: Boolean,
      default: false,
    },
    totpSecret: {
      type: String,
      default: null,
    },
    createAt: {
      type: Number, // timestamp
      default: () => Date.now(),
    },
    updatedAt: {
      type: Number, // timestamp
      default: () => Date.now(),
    },
    // Campos adicionales para manejo de sesiones
    lastLogin: {
      type: Number, // timestamp
    },
    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Number,
          default: () => Date.now(),
        },
        expiresAt: {
          type: Number,
          default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        },
      },
    ],
  },
  {
    timestamps: false, // Usamos nuestros propios timestamps
    versionKey: false,
  }
);

//* Middleware para schema de usuario

// Middleware para actualizar updatedAt antes de guardar
userSchema.pre("save", async function (next) {
  // Actualizar timestamp de modificación
  this.updatedAt = Date.now();

  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified("password")) return next();

  try {
    // Hash de la contraseña con salt de 12 rounds
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para actualizar updatedAt en operaciones de update
userSchema.pre(["updateOne", "findOneAndUpdate"], function () {
  this.set({ updatedAt: Date.now() });
});

// Método de instancia para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método de instancia para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  return userObject;
};

// Método estático para buscar usuario por nombre de usuario
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ user: username }).select("+password");
};

// Método para verificar si el usuario tiene un permiso específico
userSchema.methods.hasPermission = function (moduloName) {
  if (!this.rol || !this.rol.permissions) return false;
  return this.rol.permissions.some(
    (permission) => permission.modulo === moduloName
  );
};

// Método para verificar si el usuario tiene un rol específico
userSchema.methods.hasRole = function (roleId) {
  return this.rol && this.rol.id === roleId;
};

// Método para limpiar tokens expirados
userSchema.methods.cleanExpiredTokens = function () {
  const now = Date.now();
  this.refreshTokens = this.refreshTokens.filter(
    (token) => token.expiresAt > now
  );
  return this.save();
};

// Índices para mejorar performance
userSchema.index({ user: 1 });
userSchema.index({ "rol.id": 1 });
userSchema.index({ status: 1 });
userSchema.index({ createAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;

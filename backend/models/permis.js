module.exports = (sequelize, DataTypes) => {
  const Permis = sequelize.define('Permis', {
    numeroPermis: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    dateValidation: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Format de date invalide (YYYY-MM-DD[T00:00:00Z])'
        }
      }
    },
    dateExpiration: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isValid(value) {
          if (new Date(value) <= new Date(this.dateValidation)) {
            throw new Error('La date d\'expiration doit être après la date de validation');
          }
        }
      }
    },
    conditions: {
      type: DataTypes.TEXT,
      set(value) {
        this.setDataValue('conditions', JSON.stringify(value));
      },
      get() {
        return JSON.parse(this.getDataValue('conditions'));
      }
    },
    qrCode: {
      type: DataTypes.STRING,
      unique: true
    }
  });

  Permis.associate = models => {
    Permis.belongsTo(models.DemandePermis, {
      foreignKey: 'demandePermis_id',
      as: 'demandeAssociee',
      onDelete: 'SET NULL'
    });
    Permis.hasMany(models.Paiement, {
      foreignKey: 'permis_id',
      as: 'paiements',
      onDelete: 'CASCADE'
    });
  };

  return Permis;
};
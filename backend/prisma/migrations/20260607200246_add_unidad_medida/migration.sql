-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "precioOferta" REAL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imagenUrl" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'Vegetales',
    "unidadMedida" TEXT NOT NULL DEFAULT 'unidad',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("activo", "categoria", "createdAt", "descripcion", "id", "imagenUrl", "nombre", "precio", "precioOferta", "stock", "updatedAt") SELECT "activo", "categoria", "createdAt", "descripcion", "id", "imagenUrl", "nombre", "precio", "precioOferta", "stock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

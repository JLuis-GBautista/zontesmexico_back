import * as bcrypt from 'bcrypt';

export const encriptarClave = async (clave: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(clave, salt);
};

export const compararClaves = async (
  clave: string,
  claveEncriptada: string,
) => {
  return bcrypt.compare(clave, claveEncriptada);
};

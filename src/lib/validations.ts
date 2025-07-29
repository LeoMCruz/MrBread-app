import { z } from "zod";

// Schema para login
export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

// Schema para registro
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),

    email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),

    organization: z
      .string()
      .min(1, "Organização é obrigatória")
      .min(2, "Organização deve ter pelo menos 2 caracteres"),

    document: z
      .string()
      .min(1, "Documento é obrigatório")
      .refine((value) => {
        // Remove caracteres não numéricos
        const numbers = value.replace(/\D/g, '');
        
        // Valida CPF (11 dígitos)
        if (numbers.length === 11) {
          return validateCPF(numbers);
        }
        
        // Valida CNPJ (14 dígitos)
        if (numbers.length === 14) {
          return validateCNPJ(numbers);
        }
        
        return false;
      }, "CPF ou CNPJ inválido"),

    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter pelo menos 8 caracteres"),

    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

// Schema para recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .refine((value) => {
      // Remove caracteres não numéricos
      const numbers = value.replace(/\D/g, '');
      
      // Valida CPF (11 dígitos)
      if (numbers.length === 11) {
        return validateCPF(numbers);
      }
      
      // Valida CNPJ (14 dígitos)
      if (numbers.length === 14) {
        return validateCNPJ(numbers);
      }
      
      return false;
    }, "CPF ou CNPJ inválido"),
});

// Função para validar CPF
function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

// Função para validar CNPJ
function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
}

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

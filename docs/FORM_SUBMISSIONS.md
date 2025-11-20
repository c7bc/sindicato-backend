# Envio de Formulários - Documentação API

Este documento explica como enviar dados dos formulários de contato, newsletter e sindicalização para o backend.


> **Nota:** Todos os endpoints de criação são públicos (`create: anyone`), não precisam de autenticação.

---

## 1. Envio de Contato

**Endpoint:** `POST /api/contact-submissions`

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `nome` | string | Nome completo | "João Silva" |
| `email` | string | E-mail válido | "joao@email.com" |
| `telefone` | string | Telefone com DDD | "(91) 99999-9999" |
| `assunto` | string | Assunto da mensagem | "Dúvida sobre filiação" |
| `mensagem` | string | Mensagem completa | "Gostaria de saber..." |
| `site` | string | ID do site | "1" |

### Exemplo de Request

```javascript
async function enviarContato(dados) {
  const response = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao enviar')
  }

  return response.json()
}

// Uso
const resultado = await enviarContato({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(91) 99999-9999',
  assunto: 'Dúvida sobre filiação',
  mensagem: 'Gostaria de saber como me filiar ao sindicato.',
  site: '1', // ID do site
})

console.log('Enviado com sucesso:', resultado.doc.id)
```

### Exemplo com fetch (React)

```javascript
const handleSubmitContato = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const response = await fetch('/api/contact-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
        site: siteId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar mensagem')
    }

    const data = await response.json()
    setSuccess(true)
    // Limpar formulário
    setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

### Resposta de Sucesso

```json
{
  "message": "Envio de Contato successfully created.",
  "doc": {
    "id": "1",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(91) 99999-9999",
    "assunto": "Dúvida sobre filiação",
    "mensagem": "Gostaria de saber como me filiar ao sindicato.",
    "site": "1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 2. Inscrição Newsletter

**Endpoint:** `POST /api/newsletter-submissions`

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `nomeCompleto` | string | Nome completo | "Maria Santos" |
| `email` | string | E-mail válido | "maria@email.com" |
| `celular` | string | Celular com DDD | "(91) 98888-7777" |
| `newsletterAccepted` | boolean | Aceite dos termos | true |
| `site` | string | ID do site | "1" |

### Exemplo de Request

```javascript
async function inscreverNewsletter(dados) {
  const response = await fetch('/api/newsletter-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao inscrever')
  }

  return response.json()
}

// Uso
const resultado = await inscreverNewsletter({
  nomeCompleto: 'Maria Santos',
  email: 'maria@email.com',
  celular: '(91) 98888-7777',
  newsletterAccepted: true,
  site: '1',
})

console.log('Inscrito com sucesso:', resultado.doc.id)
```

### Exemplo com fetch (React)

```javascript
const handleSubmitNewsletter = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  if (!aceitoTermos) {
    setError('Você precisa aceitar receber a newsletter')
    setLoading(false)
    return
  }

  try {
    const response = await fetch('/api/newsletter-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        celular: formData.celular,
        newsletterAccepted: true,
        site: siteId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.message || 'Erro ao inscrever')
    }

    const data = await response.json()
    setSuccess(true)
    setFormData({ nomeCompleto: '', email: '', celular: '' })
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

### Resposta de Sucesso

```json
{
  "message": "Inscrição Newsletter successfully created.",
  "doc": {
    "id": "1",
    "nomeCompleto": "Maria Santos",
    "email": "maria@email.com",
    "celular": "(91) 98888-7777",
    "newsletterAccepted": true,
    "site": "1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 3. Solicitação de Sindicalização

**Endpoint:** `POST /api/sindicalize-submissions`

> **Importante:** Este formulário requer upload de arquivo (assinatura digital). Use `multipart/form-data`.

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `nomeCompleto` | string | Nome completo | "Carlos Oliveira" |
| `cpf` | string | CPF formatado | "123.456.789-00" |
| `email` | string | E-mail válido | "carlos@email.com" |
| `celular` | string | Celular com DDD | "(91) 97777-6666" |
| `dataNascimento` | string | Data ISO | "1985-03-15" |
| `empresaVeiculo` | string | Empresa/veículo | "Rádio XYZ FM" |
| `cargoFuncao` | string | Cargo/função | "Locutor" |
| `assinaturaDigital` | File | Imagem da assinatura | (arquivo) |
| `declaracaoLida` | boolean | Aceite dos termos | true |
| `site` | string | ID do site | "1" |

### Exemplo de Request (com upload de arquivo)

```javascript
async function solicitarSindicalizacao(dados, arquivoAssinatura) {
  // Primeiro, fazer upload da assinatura
  const formDataUpload = new FormData()
  formDataUpload.append('file', arquivoAssinatura)

  const uploadResponse = await fetch('/api/media', {
    method: 'POST',
    body: formDataUpload,
  })

  if (!uploadResponse.ok) {
    throw new Error('Erro ao fazer upload da assinatura')
  }

  const uploadResult = await uploadResponse.json()
  const assinaturaId = uploadResult.doc.id

  // Depois, criar a solicitação
  const response = await fetch('/api/sindicalize-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...dados,
      assinaturaDigital: assinaturaId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message || 'Erro ao enviar solicitação')
  }

  return response.json()
}

// Uso
const fileInput = document.getElementById('assinatura')
const arquivo = fileInput.files[0]

const resultado = await solicitarSindicalizacao({
  nomeCompleto: 'Carlos Oliveira',
  cpf: '123.456.789-00',
  email: 'carlos@email.com',
  celular: '(91) 97777-6666',
  dataNascimento: '1985-03-15',
  empresaVeiculo: 'Rádio XYZ FM',
  cargoFuncao: 'Locutor',
  declaracaoLida: true,
  site: '1',
}, arquivo)

console.log('Solicitação enviada:', resultado.doc.id)
```

### Exemplo Completo (React)

```javascript
const handleSubmitSindicalizacao = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  if (!formData.declaracaoLida) {
    setError('Você precisa aceitar os termos')
    setLoading(false)
    return
  }

  if (!assinaturaFile) {
    setError('Você precisa enviar sua assinatura digital')
    setLoading(false)
    return
  }

  try {
    // 1. Upload da assinatura
    const formDataUpload = new FormData()
    formDataUpload.append('file', assinaturaFile)

    const uploadResponse = await fetch('/api/media', {
      method: 'POST',
      body: formDataUpload,
    })

    if (!uploadResponse.ok) {
      throw new Error('Erro ao fazer upload da assinatura')
    }

    const uploadResult = await uploadResponse.json()
    const assinaturaId = uploadResult.doc.id

    // 2. Criar solicitação
    const response = await fetch('/api/sindicalize-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        email: formData.email,
        celular: formData.celular,
        dataNascimento: formData.dataNascimento, // formato: "1985-03-15"
        empresaVeiculo: formData.empresaVeiculo,
        cargoFuncao: formData.cargoFuncao,
        assinaturaDigital: assinaturaId,
        declaracaoLida: true,
        site: siteId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.message || 'Erro ao enviar solicitação')
    }

    const data = await response.json()
    setSuccess(true)
    // Limpar formulário
    setFormData({
      nomeCompleto: '',
      cpf: '',
      email: '',
      celular: '',
      dataNascimento: '',
      empresaVeiculo: '',
      cargoFuncao: '',
      declaracaoLida: false,
    })
    setAssinaturaFile(null)
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

### Resposta de Sucesso

```json
{
  "message": "Solicitação de Sindicalização successfully created.",
  "doc": {
    "id": "1",
    "nomeCompleto": "Carlos Oliveira",
    "cpf": "123.456.789-00",
    "email": "carlos@email.com",
    "celular": "(91) 97777-6666",
    "dataNascimento": "1985-03-15T00:00:00.000Z",
    "empresaVeiculo": "Rádio XYZ FM",
    "cargoFuncao": "Locutor",
    "assinaturaDigital": {
      "id": "5",
      "url": "/media/assinatura-carlos.png"
    },
    "declaracaoLida": true,
    "site": "1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Tratamento de Erros

### Resposta de Erro (Validação)

```json
{
  "errors": [
    {
      "message": "The following field is invalid: email",
      "name": "ValidationError"
    }
  ]
}
```

### Exemplo de Tratamento

```javascript
try {
  const response = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })

  const data = await response.json()

  if (!response.ok) {
    // Extrair mensagem de erro
    const errorMessage = data.errors?.[0]?.message || 'Erro desconhecido'

    // Tratar erros específicos
    if (errorMessage.includes('email')) {
      setFieldError('email', 'E-mail inválido')
    } else if (errorMessage.includes('required')) {
      setFieldError('geral', 'Preencha todos os campos obrigatórios')
    } else {
      setError(errorMessage)
    }
    return
  }

  // Sucesso
  setSuccess(true)
} catch (err) {
  setError('Erro de conexão. Tente novamente.')
}
```

---

## Validações no Frontend

### Máscaras de Input

```javascript
// Máscara de telefone
const formatTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15)
}

// Máscara de CPF
const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .substring(0, 14)
}

// Validar e-mail
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validar CPF
const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '')
  return cleaned.length === 11
}
```

### Exemplo de Componente com Validação

```javascript
function FormContato({ siteId }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido'
    }

    if (!formData.assunto.trim()) {
      newErrors.assunto = 'Assunto é obrigatório'
    }

    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, site: siteId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar')
      }

      setSuccess(true)
      setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  // ... render form
}
```

---

## Notas Importantes

1. **Autenticação não necessária** - Os endpoints de criação são públicos para permitir envios do frontend

2. **Site obrigatório** - Sempre envie o `site` ID para associar a submissão ao site correto

3. **Upload de arquivos** - Para sindicalização, primeiro faça upload para `/api/media`, depois use o ID retornado

4. **Formatos de data** - Use ISO 8601: `"YYYY-MM-DD"` ou `"YYYY-MM-DDTHH:mm:ss.sssZ"`

5. **IDs são strings** - Sempre envie IDs como strings, não números

6. **Campos required** - O backend valida campos obrigatórios e retorna erro se faltarem

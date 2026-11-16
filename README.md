# Doçura Delícia — Doceria artesanal

Redesign do projeto de Sofia Tresse, em HTML, CSS e JavaScript. Pronto para GitHub Pages, sem dependências e sem compilação.

## Abrir e publicar

Abra `index.html` no navegador. Para publicar no repositório `SofiaTresse/doceria-docura`, envie o conteúdo desta pasta para a raiz do repositório, substituindo os arquivos antigos e incluindo a pasta `assets`.

No GitHub, selecione **Settings → Pages → Deploy from a branch → main → / (root) → Save**. O endereço esperado é `https://sofiatresse.github.io/doceria-docura/` quando o Pages estiver habilitado e publicado.

As imagens ficam na própria pasta `assets`, sem depender de links de terceiros durante a navegação. As fontes DM Sans e DM Serif Display vêm do Google Fonts, com alternativas locais automáticas.

## Funcionalidades

- Vitrine com fotos reais da web, descrições e preços sempre visíveis.
- Filtros por categoria e detalhes de cada doce em diálogo acessível.
- Caixinha de seleção, controle de quantidades, remoção e total automático.
- A seleção de produtos é lembrada no navegador com `localStorage` e segue funcionando se o armazenamento estiver bloqueado.
- Simulação de encomenda com nome, data, ocasião e recadinho opcional.
- Resumo final da simulação, sem envio externo, sem cobrança e sem WhatsApp.
- Menu móvel, perguntas frequentes expansíveis, navegação por teclado e respeito à preferência por movimento reduzido.

## É uma simulação

Conforme solicitado, não existe atendimento ou pagamento conectado. Nenhum pedido ou dado do formulário é enviado. Nome, data e recadinho só são usados temporariamente na página. O navegador salva apenas os identificadores e as quantidades dos doces selecionados.

Os quatro produtos e os preços foram preservados a partir do repositório original: brownie R$ 22, cookie R$ 15, palmier R$ 18 e macaron R$ 25. A demonstração considera uma unidade de catálogo para cada item; porções reais, receitas, ingredientes, alergênicos e disponibilidade não foram validados.

## Ajustar conteúdo

- `index.html`: textos, fotos, cardápio e estrutura.
- `styles.css`: cores, tipografia, animações, telas e responsividade.
- `scripts.js`: valores em centavos no objeto `prices`, caixinha e simulação.
- Ao alterar preços, atualize tanto a vitrine no HTML quanto o objeto `prices` no JavaScript.
- Veja `CREDITOS-IMAGENS.md` para as fontes das fotografias.

O projeto utiliza somente fotografias encontradas na web. Nenhuma imagem gerada por IA foi incluída.

/**
 * Resolve o nó `author` do @graph a partir do frontmatter.
 *
 * A assinatura padrão do site é coletiva — "Redação Hachiroku" em 624 de 624
 * arquivos — e a página /equipe/ declara isso em texto: "o nome reflete um
 * trabalho coletivo, não uma opinião isolada".
 *
 * Emitir `Person` para um nome de redação faz o grafo afirmar que existe uma
 * pessoa física chamada "Redação Hachiroku". Isso é erro de entidade, não de
 * formatação: contradiz a própria página de equipe e polui a desambiguação.
 * Uma redação é a Organization, e a Organization já está declarada uma única
 * vez no BaseLayout — aqui só se referencia o @id dela.
 *
 * Person volta a ser emitido sozinho, sem tocar neste arquivo, assim que
 * houver indício de indivíduo real identificável: `credencial` preenchida ou
 * `sameAs` próprio no frontmatter.
 */
export interface Autor {
  nome?: string;
  credencial?: string;
  sameAs?: string;
}

export function autorNode(autor: Autor | undefined, site: string) {
  const identificavel = Boolean(autor?.sameAs) || Boolean(autor?.credencial);

  if (!autor || !identificavel) {
    return { '@id': `${site}/#organization` };
  }

  return {
    '@type': 'Person',
    name: autor.nome,
    url: autor.sameAs ?? `${site}/equipe/`,
    ...(autor.credencial ? { jobTitle: autor.credencial } : {}),
    ...(autor.sameAs ? { sameAs: autor.sameAs } : {}),
  };
}

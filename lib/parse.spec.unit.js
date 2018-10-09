const parse = require('./parse');

describe('[Unit] parse', () => {
  it('should be a function', () => {
    expect(parse).toBeInstanceOf(Function);
  });

  it('should parse querystrings', () => {
    let url;

    // Empty
    url = '/';
    expect(parse(url)).toMatchObject({
      href: '/',
      pathname: '/',
      query: {}
    });

    // path only
    url = '/foo/bar';
    expect(parse(url)).toMatchObject({
      href: '/foo/bar',
      pathname: '/foo/bar',
      query: {}
    });

    // NON JSON API query
    url = '/foo/bar?foo=bar';
    expect(parse(url)).toMatchObject({
      href: '/foo/bar?foo=bar',
      pathname: '/foo/bar',
      query: {foo: 'bar'}
    });

    // JSON API query
    url = '/foo/bar?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name';
    expect(parse(url)).toMatchObject({
      href: '/foo/bar?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name',
      pathname: '/foo/bar',
      query: {
        fields: {
          articles: ['title', 'body'],
          people: ['name']
        },
        include: ['author']
      }
    });

    // JSON API query with extra
    url = '/foo/bar?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name&foo=bar';
    expect(parse(url)).toMatchObject({
      href: '/foo/bar?include=author&fields%5Barticles%5D=title%2Cbody&fields%5Bpeople%5D=name&foo=bar',
      pathname: '/foo/bar',
      query: {
        fields: {
          articles: ['title', 'body'],
          people: ['name']
        },
        include: ['author'],
        foo: 'bar'
      }
    });
  });

  it('should throw invalid querystrings', () => {
    expect(() => parse()).toThrowError();
    expect(() => parse(null)).toThrowError();
    expect(() => parse({})).toThrowError();
    expect(() => parse([])).toThrowError();
  });
});

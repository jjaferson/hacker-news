import { DomainUrlPipe } from './domain-url.pipe';

describe('DomainUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new DomainUrlPipe();
    expect(pipe).toBeTruthy();
  });

  it('url undefined', () => {
    const pipe = new DomainUrlPipe();
    expect(pipe.transform(undefined)).toBeTruthy;
  })
});

import { ListAsStringPipe } from './list-as-string.pipe';

describe('ListAsStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ListAsStringPipe();
    expect(pipe).toBeTruthy();
  });
});

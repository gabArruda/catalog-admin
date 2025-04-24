import { lastValueFrom, Observable, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap with data key when meta key is not present', async () => {
    const callHandler: CallHandler<{ name: string }> = {
      handle: () => of({ name: 'test' }),
    };

    const obs$ = interceptor.intercept(
      {} as ExecutionContext,
      callHandler,
    ) as Observable<{ data: { name: string } }>;

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  it('should not wrap with data key when meta key is present', async () => {
    const data = { data: { name: 'test' }, meta: { total: 1 } };
    const callHandler: CallHandler = {
      handle: () => of(data),
    };

    const obs$ = interceptor.intercept({} as ExecutionContext, callHandler);

    const result = await lastValueFrom(obs$);
    expect(result).toEqual(data);
  });
});

import { AppError } from '@/utils/errors/app-error';
import { normalizeError } from '@/utils/errors/normalize-error';

describe('normalizeError', () => {
  it('returns an AppError unchanged', () => {
    const error = new AppError({
      code: 'API_ERROR',
      message: 'Test error',
    });

    const result = normalizeError(error);

    expect(result).toBe(error);
  });

  it('normalizes a standard Error', () => {
    const result = normalizeError(new Error('Something failed'));

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Something failed');
  });

  it('normalizes an unknown value', () => {
    const result = normalizeError('Something went wrong');

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe(
      'Something went wrong. Please try again.',
    );
  });
});

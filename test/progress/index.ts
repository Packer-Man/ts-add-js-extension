import Progress from '../../src/progress';
import { describe, it, expect } from 'vitest';

const testProgress = () =>
    describe('progress', () => {
        it('should create Progress instance when there is at least one number of file to be changed', () => {
            expect(Progress.fromNumberOfFiles(1)).toBeTruthy();
        });
        it('should throw error when there is attempt to instantiate Progress but is no file to be changed', () => {
            expect(() => Progress.fromNumberOfFiles(0)).toThrowError();
        });
    });

export default testProgress;

import { version } from '../src/index'; 
import { expect } from 'chai';
import { version as pckVersion } from "../package.json";

describe('Index test', () => { 
    it('exports correct version number', () => { 
        expect(version).to.equal(pckVersion); 
    });
});
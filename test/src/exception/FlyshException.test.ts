import { expect } from 'chai';
import { FlyshException } from '../../../src/class/exception/FlyshException';

/**
 * 'FlyshException' Main Class Test
 * 
 * TODO : test in case of no domain/incorrect from 'InputMessage' (i.e : 'http://domainx', 'abc', !empty!,...)
 * TODO : throw an exception in case of only one element from selector (#selector !empty! !empty!)
 * TODO : throw an exception in case of unexpected parameter (#selector parent child !unexpected!)
 */
describe('_________("FlyshException" Class Model Tests)_________', () => {

    /**
     * 'FlyshException' Class Model "Non-Dynamic" Tests
     */
    describe('_________("FlyshException" Class "Non-Dynamic" Tests)_________', () => {

        describe('>>> During class initialization, do : ', () => {

            it('>>> should be able to create an instance of "FlyshException" class', () => {
                const exception = new FlyshException(1,new Error(''),'');
                expect(exception).instanceOf(FlyshException);
            });

            // it('>>> should have a default message when no message is provided', () => {
            //     const exception = new FlyshException(0,new Error('An error occurred'),'An error occurred');
            //     expect(exception.name).to.equal('An error occurred');
            // });
        });
    
        describe('>>> Class method testing, do : ', () => {
            it('>>> should return the correct error ID number', () => {
                const errorID = 42;
                const exception = new FlyshException(errorID, new Error('Test error'), 'Test message');
                expect(exception.errorIDNumber).to.equal(errorID);
            });

            it('>>> should return the correct instance ID when provided', () => {
                const instanceID = 1001;
                const exception = new FlyshException(1, new Error('Test error'), 'Test message', instanceID);
                expect(exception.instanceID).to.equal(instanceID);
            });

            // it('>>> should return the default instance ID when not provided', () => {
            //     const exception = new FlyshException(1, new Error('Test error'), 'Test message');
            //     expect(exception.instanceID).to.equal(-1);
            // });

            it('>>> should return the correct name of the class', () => {
                const exception = new FlyshException(1, new Error('Test error'), 'Test message');
                expect(exception.name).to.equal('FlyshException');
            });

            
        });
        
    
    });

});
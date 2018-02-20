import { } from 'jest';

import * as React from 'react';
import { Text } from 'react-native';
import { ContextAsyncButton } from '../lib';

import * as renderer from 'react-test-renderer';

interface IContext {
  data: number;
}

async function success(_: IContext): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 0));
}

async function failure(context: IContext): Promise<void> {
  await success(context);
  throw new Error();
}

const idleComponent = () => <Text>Hey, there!</Text>;

// TODO: https://github.com/Microsoft/TypeScript/issues/6395
interface ISpecializedContextAsyncButton { new(): ContextAsyncButton<IContext>; }
// tslint:disable-next-line:variable-name
const SpecializedContextAsyncButton = ContextAsyncButton as ISpecializedContextAsyncButton;

describe('ContextAsyncButton', () => {
  describe('successful asynchronous operation', () => {
    it('should render', () => {
      const context: IContext = { data: 1 };
      const tree = renderer.create(
        <SpecializedContextAsyncButton context={context} onPress={success} IdleComponent={idleComponent} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('failing asynchronous operation', () => {
    it('should render', () => {
      const context: IContext = { data: 1 };
      const tree = renderer.create(
        <SpecializedContextAsyncButton context={context} onPress={failure} IdleComponent={idleComponent} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

import { } from 'jest';

import * as React from 'react';
import { Text } from 'react-native';
import AsyncButton from '../lib';

import * as renderer from 'react-test-renderer';

async function success(): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 0));
}

async function failure(): Promise<void> {
  await success();
  throw new Error();
}

const idleComponent = () => <Text>Hey, there!</Text>;

describe('AsyncButton', () => {
  describe('successful asynchronous operation', () => {
    it('should render', () => {
      const tree = renderer.create(<AsyncButton onPress={success} IdleComponent={idleComponent} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('failing asynchronous operation', () => {
    it('should render', () => {
      const tree = renderer.create(<AsyncButton onPress={failure} IdleComponent={idleComponent} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

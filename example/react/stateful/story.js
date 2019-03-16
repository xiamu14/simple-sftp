import React from 'react';
import { storiesOf } from '@storybook/react';
import Name from './index';

storiesOf('Name', module)
    .add('without props', () => <Name />)
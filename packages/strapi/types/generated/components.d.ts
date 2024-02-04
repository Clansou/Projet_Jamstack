import type { Schema, Attribute } from '@strapi/strapi';

export interface StepSteps extends Schema.Component {
  collectionName: 'components_step_steps';
  info: {
    displayName: 'Steps';
    description: '';
  };
  attributes: {
    Step_title: Attribute.String;
    Step_description: Attribute.RichText;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'step.steps': StepSteps;
    }
  }
}

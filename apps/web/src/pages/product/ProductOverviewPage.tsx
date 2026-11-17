import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const ProductOverviewPage: React.FC = () => <OutcomePage
  path="/product"
  eyebrow="The desktop workspace"
  title="See the work. See the decision. Know what comes next."
  intro="Syntaflow keeps the client, project, tasks, submitted versions, and handoff record in one desktop workspace. The screens here come from one sample engagement in the current build."
  result="Follow an engagement without losing its context."
  image="/product-screens/current/project.png"
  imageAlt="Syntaflow project workspace for the Harbor & Finch sample engagement."
  imageNote="Brand identity system · one sample client and project"
  points={[
    { title: 'Start with what needs attention', body: 'Home brings waiting decisions and active work into view before you open a project.' },
    { title: 'Review a named version', body: 'Comments and decisions stay associated with the submitted version they refer to.' },
    { title: 'Check the handoff gate', body: 'The delivery view shows when files still need approval before you record an external handoff.' },
  ]}
/>;

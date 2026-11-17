import React from 'react';
import { OutcomePage } from '../../components/marketing/OutcomePage';

export const AboutPage: React.FC = () => <OutcomePage
  path="/about"
  eyebrow="About Syntaflow"
  title="Client work deserves a clearer record."
  intro="Syntaflow is being built for freelancers in Tunisia and small creative teams who handle client requests, agreements, feedback, and delivery themselves."
  result="A practical workspace, shown as it is."
  image="/product-screens/current/home.png"
  imageAlt="Syntaflow Home in the current desktop preview with sample client work"
  imageNote="Current Windows preview · sample workspace"
  points={[
    { title: 'Keep the agreement in view', body: 'Bring a client update into the project, check what changed, and keep the original source nearby.' },
    { title: 'Keep decisions with versions', body: 'Reviews and approvals refer to the submitted work they discuss.' },
    { title: 'Make handoffs clearer', body: 'See unresolved approvals before recording external delivery.' },
  ]}
/>;

import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { RegistrationForm } from './widgets/HelloWorld';

const Projector = ProjectorMixin(RegistrationForm);
const projector = new Projector();

projector.append();

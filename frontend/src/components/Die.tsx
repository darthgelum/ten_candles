import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  library, IconLookup,
  IconDefinition,
  findIconDefinition
} from '@fortawesome/fontawesome-svg-core'
import { fas, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons'

const Die = ({ face, rolling }) => {
  // const iconType: string = `fa-dice-${face}`
  // const icon: IconDefinition = { prefix: 'fas' };
  library.add(fas)
  let icon: IconDefinition = faDiceOne
  switch (face) {
    case 0:
      icon = faDiceOne
      break;
    case 1:
      icon = faDiceTwo
      break;
    case 2:
      icon = faDiceThree
      break;
    case 3:
      icon = faDiceFour
      break;
    case 4:
      icon = faDiceFive
      break;
    case 5:
      icon = faDiceSix
      break;
  }
  return (
    <div>
      <FontAwesomeIcon
        icon={icon}
        className={`Die ${rolling && 'Die-shaking'}`}
      />
    </div>
  );
};

export default Die;


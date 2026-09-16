/* Cloud247 word list v1.0.0: 512 ordinary English words, bundled locally.
 * Authored for this app; not the EFF/Diceware word list.
 * 9 bits per independent draw. Default: 10 words = 90 bits. */
(function (root) {
  'use strict';
  const words = Object.freeze((
    'acorn actor adopt after again agent aglow ahead album alder alert algae amber ample angel ankle ' +
    'apple apron arbor arena argue armor aroma arrow ashore aspen atlas attic audio autumn awake award ' +
    'bacon badge bagel baker ballet bamboo banana banner barley barrel basin basket beach beacon beaver become ' +
    'beetle before begin behind berry better birch biscuit blanket blaze blossom blouse board bonnet border bottle ' +
    'bounce branch brave bread breeze brick bridge bright brook broom brown bubble bucket buckle budget buffer ' +
    'bugle build bulb bullet bundle bunker butter button cabin cable cactus camera canal candle canyon captain ' +
    'carbon cargo carrot castle casual cattle cedar celery cereal chalk change chapel cherry chest chicken chief ' +
    'chisel circle citrus city clover cobalt cobble cobra cocoa coconut coffee collar comet comic common copper ' +
    'coral corner cosmic cotton county cover coyote cradle craft crane crater cream creek cricket crisp crown ' +
    'crystal cubby cuddle cushion custom cycle daisy dancer daring dazzle dealer decent deck deeper delta denim ' +
    'desert design desk detail device dewberry dimple dinner diver doctor dolphin donkey double dragon drawer dream ' +
    'drift drink drive drum dryland duckling dune eagle early earth easel echo eclipse editor effect elbow ' +
    'elder elegant elmwood ember emerald engine enjoy enough entry envoy equal escape estate evening exact expert ' +
    'fabric falcon family famous farmer faster father feather fellow fence fennel ferry fetch fiddle field fierce ' +
    'figure filter finger finish firefly fishnet flamingo flannel flavor flight flower fluent fluffy flute folder forest ' +
    'fossil foster fountain foxglove fragile frame fresh friend fringe frozen fruit fuchsia funnel future galaxy garden ' +
    'garlic gather gentle ginger giraffe glacier glance glimmer globe golden goose gospel govern graceful grain grape ' +
    'grass gravel great green grocer ground group grove growth guava guitar habit hammer hamper handle harbor ' +
    'hardly harvest hazel healer healthy hearth heaven heavy hedgehog helmet herbal heron hidden higher hiking hillside ' +
    'hinge history hockey hollow honey honor horizon hornet horse hostel hotel humble hunter husky hybrid iceberg ' +
    'icicle iconic ignite iguana image impact indeed indigo indoor infant insect inside invent island ivory jacket ' +
    'jaguar jasmine jigsaw jockey jolly journal joyful jungle junior kettle keyboard kidney kindly kingdom kitten ladder ' +
    'lagoon lantern laptop larger laurel lavender lawyer layout leader leaflet learn ledger lemon lentil lesson letter ' +
    'level library lilac linen lizard lobster local locker lodge lofty logic lonely lotus lovely lumber lunar ' +
    'lunch lynx magic magnet mailbox major marble margin market marsh master meadow melody melon member memory ' +
    'mentor mercury merit merry metal method middle mighty millet mineral mirror mitten modern modest moment monkey ' +
    'morning mossy mother motion motto mountain mouse muffin mural museum music mustard narrow native nature nearby ' +
    'needle nephew nickel nightly noble noodle normal north notch novel nugget nylon object ocean office olive ' +
    'onion onset opera orbit orchid origin otter outer outfit oval oyster paddle painter palace panda panel ' +
    'pantry paper parcel parent parrot parsley party pasta pastel pastry patch patient pattern pause pebble pecan ' +
    'pencil pepper perfect person petal picnic pigeon pillar pilot pimple pinecone pinkish pirate pixel planet plant ' +
    'plaza plenty plover pocket poetry point polar pollen pondside ponytail poplar portal potato powder prairie pretty'
  ).split(' '));
  if (typeof module !== 'undefined' && module.exports) module.exports = words;
  else root.Cloud247Words = words;
})(typeof globalThis !== 'undefined' ? globalThis : this);

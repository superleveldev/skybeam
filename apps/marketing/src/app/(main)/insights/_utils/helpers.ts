import { DmaStateLookup } from './types';

function mapToLabelName(dmaStatesLookup: DmaStateLookup) {
  return dmaStatesLookup.map((entry) => ({
    label: entry.dma_name,
    value: entry.dma_name,
    id: `${entry.dma_name}-${entry.state}`,
  }));
}

export { mapToLabelName };

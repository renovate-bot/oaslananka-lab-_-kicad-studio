import { KiCadImportService } from '../../src/cli/importCommands';

describe('KiCadImportService', () => {
  it('guards gEDA imports unless kicad-cli help advertises the format', async () => {
    const detector = {
      hasCapability: jest.fn().mockResolvedValue(true),
      getCommandHelp: jest
        .fn()
        .mockResolvedValue('Usage: kicad-cli pcb import --format pads|altium')
    };
    const service = new KiCadImportService(
      {} as never,
      detector as never,
      { error: jest.fn() } as never
    ) as unknown as {
      isImportFormatSupported(format: string): Promise<boolean>;
    };

    await expect(service.isImportFormatSupported('geda')).resolves.toBe(false);

    detector.getCommandHelp.mockResolvedValue(
      'Usage: kicad-cli pcb import --format pads|altium|geda'
    );
    await expect(service.isImportFormatSupported('geda')).resolves.toBe(true);
  });
});

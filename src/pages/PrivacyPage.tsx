import { PageHeader } from '@/components/ui/PageHeader';

/** Eenvoudige privacyverklaring. Pas de contactgegevens aan voordat je accounts aanzet. */
export function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy" intro="Wat Woordwerk bewaart, en waarom." />
      <div className="flex max-w-[70ch] flex-col gap-4 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold">Zonder account</h2>
          <p>Alles wat je invoert (lijsten, voortgang, foto's, instellingen) staat alleen in je eigen browser op dit apparaat. Niemand anders kan het zien.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Met een account</h2>
          <p>We bewaren je e-mailadres en wachtwoord (versleuteld) om je te laten inloggen, en een kopie van je lijsten, voortgang en instellingen om ze op je andere apparaten te laten zien. Foto's van je boek en woordplaatjes blijven op je apparaat. De gegevens staan bij Supabase, op servers in de EU (als je dat bij het aanmaken van het project hebt gekozen).</p>
          <p className="mt-2">Je kunt je account altijd zelf verwijderen bij Account. Dan wordt alles in je account gewist.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Bezoekersteller</h2>
          <p>We tellen anoniem welke pagina's bekeken worden, zonder cookies en zonder te weten wie je bent. Je kunt dit uitzetten bij Instellingen.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Jonger dan 16?</h2>
          <p>Vraag dan je ouders om toestemming voordat je een account maakt.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold">Vragen?</h2>
          <p>Neem contact op met de maker van Woordwerk.</p>
        </section>
      </div>
    </>
  );
}

import nlp from 'compromise';
import partiesData from '../data/parties.json';

/**
 * Domain Classifier: Checks if the query is election-related.
 */
export const isElectionRelated = (text) => {
    const doc = nlp(text.toLowerCase());
    const words = doc.terms().json().map(t => t.text);

    // Check against keywords in JSON
    const matches = words.some(word =>
        partiesData.keywords.some(kw => word.includes(kw) || kw.includes(word))
    );

    // Also check if any party name or symbol is mentioned directly
    const mentionedParty = partiesData.parties.some(p =>
        text.toLowerCase().includes(p.name.toLowerCase()) ||
        text.toLowerCase().includes(p.shortName.toLowerCase()) ||
        text.toLowerCase().includes(p.symbol.toLowerCase())
    );

    return matches || mentionedParty;
};

/**
 * Intent Classifier: Determines what the user wants to know.
 */
export const classifyIntent = (text) => {
    const lowText = text.toLowerCase();

    if (lowText.includes('symbol') || lowText.includes('icon') || lowText.includes('logo')) {
        return 'PARTY_SYMBOL_QUERY';
    }

    if (lowText.includes('slogan') || lowText.includes('tagline') || lowText.includes('motto')) {
        return 'SLOGAN_QUERY';
    }

    if (lowText.includes('cm') || lowText.includes('chief minister') || lowText.includes('candidate') || lowText.includes('proposed')) {
        return 'CM_CANDIDATE_QUERY';
    }

    if (lowText.includes('tell me about') || lowText.includes('who is') || lowText.includes('information') || lowText.includes('what is')) {
        return 'PARTY_INFO';
    }

    return 'GENERAL_INQUIRY';
};

/**
 * Entity Extractor: Identifies the party or symbol in the query.
 */
export const extractEntity = (text) => {
    const lowText = text.toLowerCase();

    // Find party
    const party = partiesData.parties.find(p =>
        lowText.includes(p.name.toLowerCase()) ||
        lowText.includes(p.shortName.toLowerCase())
    );

    if (party) return { type: 'PARTY', value: party };

    // Find symbol
    const symbolMatch = partiesData.parties.find(p =>
        lowText.includes(p.symbol.toLowerCase())
    );

    if (symbolMatch) return { type: 'SYMBOL', value: symbolMatch };

    // Find slogan
    const sloganMatch = partiesData.parties.find(p =>
        p.slogans.some(s => lowText.includes(s.toLowerCase()))
    );

    if (sloganMatch) return { type: 'SLOGAN', value: sloganMatch };

    return null;
};

/**
 * Response Generator: Processes query and returns answer.
 */
export const generateResponse = (text) => {
    if (!isElectionRelated(text)) {
        return "Sorry, I am trained only for election related queries.";
    }

    const intent = classifyIntent(text);
    const entity = extractEntity(text);

    if (!entity) {
        return "Could you please specify which party or symbol you are asking about?";
    }

    const party = entity.value;

    switch (intent) {
        case 'PARTY_SYMBOL_QUERY':
            return `The symbol of ${party.shortName} (${party.name}) is ${party.symbol}.`;

        case 'SLOGAN_QUERY':
            return `The slogans for ${party.shortName} include: ${party.slogans.join(', ')}.`;

        case 'CM_CANDIDATE_QUERY':
            return `The CM candidate for ${party.shortName} is ${party.cmCandidate}.`;

        case 'PARTY_INFO':
            return `${party.name} (${party.shortName}) uses the ${party.symbol} symbol. Their main candidate is ${party.cmCandidate} and one of their slogans is "${party.slogans[0]}".`;

        default:
            return `${party.name} is a political party. Their symbol is ${party.symbol} and their leader is ${party.cmCandidate}.`;
    }
};

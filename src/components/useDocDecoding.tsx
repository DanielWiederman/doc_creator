import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FuzzySet from 'fuzzyset.js'
import { useEffect, useState } from 'react'

const PASSPORT_LENGTH = 8
const ID_LENGTH = 9

const fuzzy = FuzzySet([
    'name',
    'Surname',
], false)

const isrealiFormat = 'DD/MM/YYYY'

dayjs.extend(customParseFormat);

export const useTextDecoding = (words: Tesseract.Word[]) => {
    const [passportNumber, setPassportNumber] = useState<string>("")
    const [idNumber, setIdNumber] = useState<string>("")
    const [names, setNames] = useState<string[]>([])
    const [docDates, setDocDates] = useState<Dayjs[]>([])

    const isPassportNumber = (str: string) => {
        if (str.length === PASSPORT_LENGTH) {
            if (Number(str)) {
                return true
            }
        }
        return false
    }

    const isIDNumber = (str: string) => {
        if (str.length === ID_LENGTH) {
            if (Number(str)) {
                return true
            }
        }
        return false
    }

    const isDateValid = (str: string, format = isrealiFormat) => {
        return dayjs(str, format, "il", true).isValid();
    };


    useEffect(() => {
        let shouldPickName = false
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const cleanWordText = word.text.replace(new RegExp(/[^0-9a-zא-ת /]/gi), "").trim()
            const closeWord = fuzzy.get(cleanWordText)?.[0]?.[1];

            if (isPassportNumber(cleanWordText)) {
                setPassportNumber(cleanWordText)
                continue
            }

            if (isIDNumber(cleanWordText)) {
                setIdNumber(cleanWordText)
                continue
            }

            if (shouldPickName) {
                setNames((prevNames) => [...prevNames, cleanWordText])
                shouldPickName = false
                continue
            }

            if (closeWord) {
                shouldPickName = true
                continue
            }

            if (isDateValid(cleanWordText)) {
                setDocDates((prevDates) => [...prevDates, dayjs(cleanWordText, isrealiFormat, "il")].sort().reverse())
                continue
            }
        }
    }, [words])

    return { names, passportNumber, idNumber, docDates }
}

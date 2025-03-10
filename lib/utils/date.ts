import { parse, format } from 'date-fns'
import { addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function addDaysToDate(dateStr: string, days: number): string {

  const date = parse(dateStr, 'dd/MM/yyyy', new Date())
  const newDate = addDays(date, days)

  return format(newDate, 'dd/MM/yyyy', { locale: ptBR })
}


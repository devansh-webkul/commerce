import { useCallback } from 'react'
import { useHook, useMutationHook } from '@vercel/commerce/utils/use-hook'
import { mutationFetcher } from '@vercel/commerce/utils/default-fetcher'

import useCheckout from './use-checkout'

import type { Provider } from '@vercel/commerce'
import type { HookFetcherFn, MutationHook } from '@vercel/commerce/utils/types'

export type UseAddAddresses<H extends MutationHook<any> = MutationHook<any>> =
  ReturnType<H['useHook']>

export const fetcher: HookFetcherFn<any> = mutationFetcher

const fn = (provider: Provider) => provider.checkout?.useAddAddresses!

const useAddAddresses: UseAddAddresses = (...args) => {
  const hook = useHook(fn)
  return useMutationHook({ fetcher, ...hook })(...args)
}

export default useAddAddresses as UseAddAddresses<typeof handler>

export const handler: MutationHook<any> = {
  fetchOptions: {
    url: '/api/checkout/add-addresses',
    method: 'POST',
  },

  async fetcher({ input: { addresses }, options, fetch }) {
    const data = await fetch({
      ...options,
      body: { addresses },
    })

    return data
  },

  useHook: ({ fetch }) =>
    function useHook() {
      const { mutate } = useCheckout()

      return useCallback(
        async function addAddresses(input) {
          const data = await fetch({ input })

          await mutate([data], false)

          return data
        },
        [fetch, mutate]
      )
    },
}